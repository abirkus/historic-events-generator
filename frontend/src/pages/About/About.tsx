const About = () => {
  return (
    <>
      <div className="flex flex-col items-center p-6">
        <div className="flex flex-col items-center  mb-4 w-1/2">
          <h1 className="text-black text-xl pl-4">
            Welcome to Historic Events Generator
          </h1>
          <h3 className="text-black text-lg pl-4">
            This site was built as an exercise for utilizing various AI models
            with the purpose of generating important historic events at a
            specific date in time. Go ahead make your selections for the desired
            AI model and the date of interest and see what you might learn. Who
            know, maybe your birthday is a special day after all?{" "}
          </h3>
        </div>
      </div>
    </>
  );
};

export default About;
