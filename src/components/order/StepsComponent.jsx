const StepsComponent = ({ currentStep, steps }) => (
  <div className="w-full max-w-5xl mx-auto">
    <ol className="flex flex-col md:flex-row items-start md:items-center justify-between w-full p-4 space-y-4 md:space-y-0 md:space-x-8 xl:px-8">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <li key={index} className="flex-1 w-full">
            {/* ... step rendering logic ... */}
          </li>
        );
      })}
    </ol>
  </div>
);

export default StepsComponent;
