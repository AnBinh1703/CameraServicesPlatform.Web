import { NavLink } from "react-router-dom";

const ManagementHeader = () => {
  return (
    <header className="navbar bg-black text-white py-4">
      <div className="navbar-start">
        <label
          htmlFor="my-drawer-2"
          className="mx-10 bg-white text-primary drawer-button lg:hidden cursor-pointer"
        >
          <i className="fa-solid fa-bars text-black"></i>
        </label>
        <NavLink to={"/"}>
          <span className="mx-10 normal-case text-xl font-bold text-red-600">
            CameraServicePlatform
          </span>
        </NavLink>
      </div>
    </header>
  );
};

export default ManagementHeader;
