import Link from "next/link";

interface PageBreadcrumbProps {
  currentPage: string;
}

export function PageBreadcrumb({ currentPage }: PageBreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {/* <Link href="/" className="breadcrumb-link">
        Home
      </Link> */}
      {/* <span className="breadcrumb-separator">&gt;</span> */}
      {/* <span className="breadcrumb-current">{currentPage}</span> */}
    </nav>
  );
}
