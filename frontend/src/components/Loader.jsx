const Loader = ({ fullscreen }) => (
  <div className={`${fullscreen ? 'min-h-screen' : ''} flex items-center justify-center w-full`}>
    <div className="h-10 w-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
  </div>
);

export default Loader;
