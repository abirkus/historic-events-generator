import aiLogo from "../../assets/ai-generated.jpg";

const Header = () => {
  return (
    <div
      className="w-full flex justify-start items-center border-b px-6"
      style={{
        backgroundColor: "#002A42",
        borderColor: "#E8E8EA",
        height: "50px",
      }}
    >
      <img src={aiLogo} className="logo" alt="AI Logo" width={40} height={40} />
    </div>
  );
};

export default Header;
