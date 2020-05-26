// Package content provides functionality for delivering
// textual content to the frontend. The current file types
// supported are Markdown and PDFs. Markdown is rendered
// as HTML from the frontend while PDFs are served to the
// browser directly by the backend.
//
// The environment variable under the key "FS_ROOT" specifies
// the directory containing the content that the backend
// needs to serve.
//
// In order for the backend to interpret the content in "FS_ROOT"
// and serve it appropriately, the following directory structure
// convention has been established.
//  .
//  └── fs_root
//    └── <topic_id>:<topic_name>
//        └── <content_type_id>:<file_extension>:<content_type_name>
//            |── enum.txt // line format <resource_id>%%<title>%%<description>
//            └── <resource_id>.<file_extension>
//
// The Unix Kernel allows file names to contain almost any
// character and so it is possible to use the ':' character to
// have a richer file system.
package content

import (
	"fmt"
	"io/ioutil"
	"log"
	"strings"
	"sync"
	"time"
)

var fs *Fs

type Resource struct {
	ID          string `json:"ID"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type ContentType struct {
	ID        string     `json:"contentTypeID"`
	Name      string     `json:"contentTypeName"`
	FileExt   string     `json:"fileExt"`
	Resources []Resource `json:"resources"`
}

type Topic struct {
	ID           string        `json:"topicID"`
	Name         string        `json:"topicName"`
	ContentTypes []ContentType `json:"contentTypes"`
}

// Fs is a type representing the directory structure of "FS_ROOT".
// Since this type is to be accessed by multiple HTTP connections,
// it has to be designed with concurrency in mind.
type Fs struct {
	Root          string
	Index         []Topic
	PdfPaths      map[string]string
	ResourcePaths map[string]string
	mu            sync.Mutex
}

// FullIndex returns a complete index of the content of fs.Root.
func (fs *Fs) FullIndex() []Topic {
	fs.mu.Lock()
	defer fs.mu.Unlock()
	return fs.Index
}

// GetResource returns a serialized version of the document specified
// from the host filesystem.
func (fs *Fs) GetResource(topicID, contentTypeID, resourceID string) ([]byte, error) {
	resourceLocator := fmt.Sprintf("%s/%s/%s", topicID, contentTypeID, resourceID)
	resourcePath := fs.ResourcePaths[resourceLocator]
	if resourcePath == "" {
		return nil, fmt.Errorf("unable to locate resource")
	}
	filePath := fmt.Sprintf("%s/%s", fs.Root, resourcePath)
	if f, err := ioutil.ReadFile(filePath); err != nil {
		return nil, fmt.Errorf("unable to locate resource")
	} else {
		return f, nil
	}
}

// GetPDFPath returns the file system path to locate the specified
// pdf document. If the document does not exist, the returned path
// is an empty string.
func (fs *Fs) GetPDFPath(topicID, resourceID string) string {
	resourceLocator := fmt.Sprintf("%s/pdfs/%s", topicID, resourceID)
	if resourceLocator == "" {
		return ""
	}
	resourcePath := fmt.Sprintf("%s/%s", fs.Root,
		fs.PdfPaths[resourceLocator])
	return resourcePath
}

// Enumerate is a routine which re-indexes the file system to serve.
func (fs *Fs) Enumerate() {
	go func() {
		for {
			var enumTopics []Topic
			enumPdfPaths := make(map[string]string)
			enumResourcePaths := make(map[string]string)

			topics, err := ioutil.ReadDir(fs.Root)
			if err != nil {
				log.Fatal("err: failed to enumerate fs.Root")
			}

			for _, topicEntry := range topics {
				if !topicEntry.IsDir() {
					continue
				}
				topicNameParts := strings.Split(topicEntry.Name(), ":")
				if len(topicNameParts) != 2 {
					//log.Printf("err: invalid topic '%s'\n", topicEntry.Name())
					continue
				}
				newTopic := Topic{
					ID:           topicNameParts[0],
					Name:         topicNameParts[1],
					ContentTypes: []ContentType{},
				}
				contentTypeDir := fmt.Sprintf("%s/%s", fs.Root, topicEntry.Name())
				contentTypes, err := ioutil.ReadDir(contentTypeDir)
				if err != nil {
					//log.Printf("err: failed to enumerate content types in topic '%s'\n",
					//	contentTypeDir)
					continue
				}
				for _, contentType := range contentTypes {
					if !contentType.IsDir() {
						continue
					}
					contentTypeNameParts := strings.Split(contentType.Name(), ":")
					if len(contentTypeNameParts) != 3 {
						//log.Printf("err: invalid content type name '%s' under topic '%s'\n",
						//	contentType.Name(), newTopic.Name)
						continue
					}
					newContentType := ContentType{
						ID:        contentTypeNameParts[0],
						Name:      contentTypeNameParts[2],
						FileExt:   contentTypeNameParts[1],
						Resources: []Resource{},
					}
					// read enum.txt
					enumFilePath := fmt.Sprintf("%s/%s/enum.txt", contentTypeDir, contentType.Name())
					enumFile, err := ioutil.ReadFile(enumFilePath)
					if err != nil {
						//log.Printf("err: no enum.txt file at '%s/%s'", contentTypeDir, contentType.Name())
						continue
					}
					enumEntries := strings.Split(string(enumFile), "\n")
					for _, resourceEntry := range enumEntries {
						resourceSpecs := strings.Split(resourceEntry, "%%")
						if len(resourceSpecs) != 3 {
							//log.Printf("err: enum entry %d in '%s' invalid", i, contentTypeDir)
							continue
						}
						newResource := Resource{
							ID:          resourceSpecs[0],
							Name:        resourceSpecs[1],
							Description: resourceSpecs[2],
						}
						newContentType.Resources = append(newContentType.Resources, newResource)
						// add path
						resourcePath := fmt.Sprintf("%s/%s/%s.%s", topicEntry.Name(), contentType.Name(),
							newResource.ID, newContentType.FileExt)
						resourceLocator := fmt.Sprintf("%s/%s/%s", newTopic.ID, newContentType.ID,
							newResource.ID)

						if newContentType.ID == "pdfs" {
							enumPdfPaths[resourceLocator] = resourcePath
						} else {
							enumResourcePaths[resourceLocator] = resourcePath
						}
					}
					newTopic.ContentTypes = append(newTopic.ContentTypes, newContentType)
				}
				enumTopics = append(enumTopics, newTopic)
			}

			fs.mu.Lock()
			fs.Index = enumTopics
			fs.PdfPaths = enumPdfPaths
			fs.ResourcePaths = enumResourcePaths
			fs.mu.Unlock()

			time.Sleep(30 * time.Second)
		}
	}()
}

func Init(fsRoot string) {
	fs = &Fs{
		Root: fsRoot,
		mu:   sync.Mutex{},
	}
	fs.Enumerate()
}
