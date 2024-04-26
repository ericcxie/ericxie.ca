import { IoLogoInstagram, IoLogoLinkedin, IoLogoGithub } from "react-icons/io5";

export default function Footer() {
  return (
    <footer className="text-text-light-body dark:text-text-dark-body fixed inset-x-0 bottom-4 border-t border-gray-300 pt-3">
      <div className="mx-auto flex max-w-[700px] items-center justify-between px-6 text-center md:flex-row md:px-6">
        <div className="flex flex-col justify-start text-start">
          <p className="text-lg">Made with ☕️</p>
          <p className="text-sm">© 2024 Eric Xie</p>
        </div>
        <div className="flex justify-end gap-1">
          <a
            href="https://www.instagram.com/ericcxie"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoLogoInstagram className="text-2xl" />
          </a>
          <a
            href="https://www.linkedin.com/in/ericcxie"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoLogoLinkedin className="text-2xl" />
          </a>
          <a
            href="https://github.com/ericcxie"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoLogoGithub className="text-2xl" />
          </a>
        </div>
      </div>
    </footer>
  );
}
