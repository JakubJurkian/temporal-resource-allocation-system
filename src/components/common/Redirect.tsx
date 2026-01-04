import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  to: string;
}

const Redirect = ({ to }: Props) => {
  const navigate = useNavigate();

  useEffect(() => {
    // This puts the navigation at the end of the event loop
    // preventing the collision with Framer Motion
    // React Router's <Navigate> component conflicts with Framer Motion's <AnimatePresence>.
    //The Problem:
    //AnimatePresence tries to keep the "old" page alive to animate it out.
    //<Navigate> tries to immediately unmount the current component and switch URLs.
    //React panics because two libraries are fighting over the component's lifecycle at the exact same millisecond.
    navigate(to, { replace: true });
  }, [navigate, to]);

  return null; // Render nothing visually
};

export default Redirect;