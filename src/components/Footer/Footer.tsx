import { IoLogoInstagram, IoLogoLinkedin, IoLogoGithub } from "react-icons/io5";

export default function Footer() {
  return (
    <footer className="inset-x-0 border-t border-zinc-500 bg-background-light py-3 text-text-light-body dark:bg-background-dark dark:text-text-dark-body">
      <div className="mx-auto flex max-w-[700px] items-center justify-between px-6 text-center md:flex-row md:px-6">
        <div className="flex flex-col justify-start text-start">
          <p className="md:text-md text-sm">Made with {"<3"}</p>
          <p className="text-xs md:text-sm">
            © {new Date().getFullYear()} Eric Xie.
          </p>
        </div>
        <div className="flex justify-end gap-1">
          <a
            href="https://www.instagram.com/ericcxie"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoLogoInstagram className="text-2xl hover:text-text-light-headerLight dark:hover:text-text-dark-headerDark" />
          </a>
          <a
            href="https://www.linkedin.com/in/ericcxie"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoLogoLinkedin className="text-2xl transition duration-500 hover:text-text-light-headerLight dark:hover:text-text-dark-headerDark" />
          </a>
          <a
            href="https://github.com/ericcxie"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoLogoGithub className="text-2xl transition duration-500 hover:text-text-light-headerLight dark:hover:text-text-dark-headerDark" />
          </a>
        </div>
      </div>
    </footer>
  );
}
