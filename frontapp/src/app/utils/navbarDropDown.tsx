import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

type GreetingsProps = {
  data: {};
  onClick: Function;
};

const NavbarDropDown = ({ data, onClick }: GreetingsProps) => {
  return (
    <Menu as="div" className="relative inline-block text-left me-3">
      <div>
        <Menu.Button className=" inline-flex justify-center gap-x-1.5 rounded-md bg-white px-1 py-1 text-sm font-semibold text-gray-900 shadow-sm ">
          <div className="flex items-center">
            <div className="flex items-center">
              <img
                className="h-10 w-10 object-cover rounded-full border me-2"
                id="preview2"
                src={data && data?.memberImgPath}
                alt="MemberProfile"
              />
              {data && data.username}
            </div>
          </div>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href={"/member/mypage"}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  My page
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => onClick()}
                  className={classNames(
                    active ? "bg-gray-100 text-red-800" : "text-red-800",
                    "block px-4 py-2 text-sm w-100"
                  )}
                >
                  로그아웃
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default NavbarDropDown;
