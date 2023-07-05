import { motion } from "framer-motion";

interface LoadingProps {
  text?: string;
}

export const Loading = ({ text }: LoadingProps) => {
  return (
    <div className="flex justify-center h-screen w-screen">
      {text && (
        <p className="mt-1 text-lg dark:text-gray-400 text-gray-500">{text}</p>
      )}
      <motion.div
        className="flex bg-indigo-900 rounded justify-center m-auto h-10 w-10"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          ease: [0.075, 0.82, 0.165, 1],
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  );
};
