import { type ReactNode } from "react";
import { SideNav } from "./SideNav";
import { TopNav } from "./TopNav";

interface Props {
  children: ReactNode;
  pageTitle: string;
}

export const MainLayout = ({ children, pageTitle }: Props): JSX.Element => {
  return (
    <div className="flex w-screen h-screen">
      <SideNav />
      <div className="flex flex-col flex-grow shrink-0">
        <TopNav />
        <main className="flex-1 p-8 overflow-auto overflow-x-auto bg-[#555555]">
          <h1 className="mb-8 text-2xl font-semibold font text-sky-600">
            {pageTitle}
          </h1>
          {children}
        </main>
      </div>
    </div>
  );
};
