interface LoadingScreenProps {
    message?: string;
    description?: string;
  }
  
  export const LoadingScreen = ({ 
    message = "Loading Experience",
    description = "Please wait while we prepare your interactive experience..."
  }: LoadingScreenProps) => {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <div className="animate-pulse">
            <h2 className="text-xl font-semibold text-gray-700">{message}</h2>
            <p className="text-gray-500 mt-2">{description}</p>
          </div>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        </div>
      </div>
    );
  };