import Badge from '../badge';
import PlanExecution from '../pricing/plan-execution';

type Props = {};

function Pricing({}: Props) {
  return (
    <div className="mt-10 w-full rounded-sm">
      <div className="max-w-5xl w-full mx-auto flex flex-col items-center justify-center">
        <Badge name="Pricing" />
        <h1 className="h2 text-primary font-semibold">You probably won&apos;t need to pay. Yet.</h1>
        <p className="text-center">
          Start free and see how far you get. When Sync becomes mission-critical, <br />{' '}
          <b>you’ll know.</b>
        </p>
      </div>
      <div
        className="
          relative
          flex 
          items-center
          justify-center
          my-10
        "
      >
        <PlanExecution />
      </div>
    </div>
  );
}

export default Pricing;
