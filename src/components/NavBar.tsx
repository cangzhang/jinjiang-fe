import { Link } from 'react-router-dom';

export function NavBar() {
  return (
    <header
      className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white text-sm py-4 dark:bg-gray-800">
      <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between" aria-label="Global">
        <Link className="flex-none text-xl font-semibold dark:text-white" to="/">JinJiang</Link>
        <div className="flex flex-row items-center gap-5 mt-5 sm:justify-end sm:mt-0 sm:pl-5">
          <Link className="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500"
                to="/">Home</Link>
          <Link className="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500"
                to="/novels">Novels</Link>
        </div>
      </nav>
    </header>
  );
}
