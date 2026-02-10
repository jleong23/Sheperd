export default function ({ title, children, footer }) {
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Dreamers"
          src="/dreamersLogo.png"
          className="mx-auto h-20 w-auto rounded-full"
        />
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          {title}
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {children}
        {footer}
      </div>
    </div>
  );
}
