package fs

// Categorizer is a kind of content organizer. It serves content organized by
// categories and sub categories and so on, captured by the directory structure
// of the file system subtree at the Categorizer.Root().
type Categorizer interface {
	// Root returns the path of the file system subtree from which content
	// is being served.
	Root() string
	// ReIndex is a method to crawl the file system subtree at the Categorizer
	// root.
	ReIndex()
}

type Category struct {
	Name          string
	Description   string
	SubCategories []*Category
	Resources     []*Resource
}

type Resource struct {
	Name        string
	Description string
	Cached      []byte
	CachHash    []byte
}

// SiteContent is a Categorizer which handles the content served on the site.
type SiteContent struct {
	mu   *sync.Mutex
	root string
}

// Root returns the path to the file system subtree whose content is being
// served.
func (sc *SiteContent) Root() string { return sc.root }

func (sc SiteContent) ReIndex() {
}
