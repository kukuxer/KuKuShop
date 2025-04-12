import { FaShieldAlt, FaLock, FaTruck, FaUserShield } from "react-icons/fa";

const SecurityInfo = () => {
  const benefits = [
    {
      icon: <FaShieldAlt className="w-6 h-6 text-purple-500" />,
      title: "Secure Payment",
      description: "Encrypted transactions"
    },
    {
      icon: <FaTruck className="w-6 h-6 text-purple-500" />,
      title: "Safe Shipping",
      description: "Tracked delivery"
    },
    {
      icon: <FaUserShield className="w-6 h-6 text-purple-500" />,
      title: "Data Privacy",
      description: "Protected information"
    },
    {
      icon: <FaLock className="w-6 h-6 text-purple-500" />,
      title: "Guaranteed",
      description: "Easy returns"
    }
  ];

  return (
    <div className="w-full max-w-md mx-auto p-2">
      <div className="bg-gray-800 rounded-lg p-3 shadow-lg border border-purple-500/20">
        <h2 className="text-lg font-semibold text-center text-white mb-3 hover:text-purple-400 transition-colors duration-300">
          Shop with Confidence ✅
        </h2>

        <div className="grid grid-cols-2 gap-2">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-gray-900 p-2 rounded transform hover:scale-102 transition-all duration-300 hover:bg-gray-900/80 border border-purple-500/10 hover:border-purple-500/30"
              role="article"
              aria-label={benefit.title}
            >
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-purple-500/10 rounded">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white hover:text-purple-400 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-gray-300">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityInfo;