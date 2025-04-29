
import { useLocation } from "react-router-dom";
import { SidebarWrapper } from "./Sidebar";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
}

const PageLayout = ({ children, title }: PageLayoutProps) => {
  return (
    <SidebarWrapper>
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">{title} </h2>
        </div>
        {children}
      </main>
    </SidebarWrapper>
  );
};

export default PageLayout;
