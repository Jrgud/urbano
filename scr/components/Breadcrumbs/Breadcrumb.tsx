import { Link } from 'react-router-dom';
interface BreadcrumbProps {
  pageMain?: string;
  pageName: string;
}
const Breadcrumb = ({ pageName ,pageMain}: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3  ">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" to="/">
              Geop Map /{pageMain?pageMain+'/':''}
            </Link>
          </li>
          <li className="font-medium text-black dark:text-white">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
