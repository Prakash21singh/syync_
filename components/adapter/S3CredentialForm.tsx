import { useState } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { AWSCredentials } from "@/types";
import { UseAdapterReturn } from "@/hooks/use-adap";
import { Loader2 } from "lucide-react";

const AWS_REGIONS = [
  "us-east-1","us-east-2","us-west-1","us-west-2",
  "ap-south-1","ap-southeast-1","ap-southeast-2",
  "ap-northeast-1","ap-northeast-2",
  "ca-central-1",
  "eu-central-1","eu-west-1","eu-west-2","eu-west-3","eu-north-1",
  "sa-east-1",
];

function S3CredentialForm({ adapter }: { adapter: UseAdapterReturn }) {
  const [form, setForm] = useState({
    accessKeyId: "",
    secretAccessKey: "",
    region: "",
  });

  const [showSecret, setShowSecret] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isValidated = !!adapter.awsUser;

  // ---------------- VALIDATION ----------------
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.accessKeyId.trim())
      newErrors.accessKeyId = "Access Key ID is required.";
    else if (!/^[A-Z0-9]{16,}$/.test(form.accessKeyId.trim()))
      newErrors.accessKeyId = "Invalid format.";

    if (!form.secretAccessKey.trim())
      newErrors.secretAccessKey = "Secret Access Key is required.";
    else if (form.secretAccessKey.length < 20)
      newErrors.secretAccessKey = "Too short.";

    if (!form.region)
      newErrors.region = "Select a region.";

    return newErrors;
  };

  // ---------------- HANDLERS ----------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If already validated → now linking stage
    if (isValidated) {
      // 👉 call your link API here
      const response = await fetch("/api/adapter/create/manual",{
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          adapter_type: "AWS_S3",
          accessKeyId: form.accessKeyId,
          accessKeySecret:form.secretAccessKey,
          region:form.region,
          username: adapter.awsUser?.username,
          arn: adapter.awsUser?.arn,
          userId: adapter.awsUser?.userId
        })
      });

      const result = await response.json()

      console.log(result)

      if(result.success){
        adapter.reset()
      }else{
        adapter.setError(result.error)
      }

    }

    const newErrors = validate();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    await adapter.validateAWSCredentials(form);
  };

  const handleEdit = () => {
    adapter.reset?.(); // optional (if you implement)
  };

  // ---------------- LOADING STATE ----------------
  if (adapter.isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-sm p-6 space-y-4 border border-border bg-background shadow-sm my-2"
    >
      {/* FORM FIELDS */}
      <div className="space-y-4">

        {/* ACCESS KEY */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs uppercase">
            Access Key ID
          </label>
          <Input
            name="accessKeyId"
            value={form.accessKeyId}
            onChange={handleChange}
            disabled={isValidated}
            placeholder="AKIA..."
            className={cn(
              "pr-8",
              errors.accessKeyId && "border-destructive"
            )}
          />
          {errors.accessKeyId && (
            <p className="text-destructive text-xs">{errors.accessKeyId}</p>
          )}
        </div>

        {/* SECRET KEY */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs uppercase">
            Secret Access Key
          </label>

          <div className="relative">
            <Input
              name="secretAccessKey"
              type={showSecret ? "text" : "password"}
              value={form.secretAccessKey}
              onChange={handleChange}
              disabled={isValidated}
              className={cn(
                "pr-8",
                errors.secretAccessKey && "border-destructive"
              )}
            />

            <button
              type="button"
              onClick={() => setShowSecret((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              👁
            </button>
          </div>

          {errors.secretAccessKey && (
            <p className="text-destructive text-xs">{errors.secretAccessKey}</p>
          )}
        </div>

        {/* REGION */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs uppercase">
            Region
          </label>

          <select
            name="region"
            value={form.region}
            onChange={handleChange}
            disabled={isValidated}
            className={cn(
              "w-full h-10 px-3 border rounded-sm",
              errors.region && "border-destructive"
            )}
          >
            <option value="">Select region</option>
            {AWS_REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {errors.region && (
            <p className="text-destructive text-xs">{errors.region}</p>
          )}
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {adapter.error && (
        <p className="text-destructive text-xs text-center">
          {adapter.error}
        </p>
      )}

      {/* SUCCESS INFO */}
      {isValidated && adapter.awsUser && (
        <div className="text-xs text-center space-y-1 text-muted-foreground">
          <p>Connected as:</p>
          <p className="text-foreground font-medium">
            {adapter.awsUser.username}
          </p>
          <p className="truncate">{adapter.awsUser.arn}</p>

          <button
            type="button"
            onClick={handleEdit}
            className="text-primary text-xs underline mt-1"
          >
            Edit Credentials
          </button>
        </div>
      )}

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        className="
          w-full h-10 rounded-sm font-semibold text-sm
          bg-primary text-primary-foreground
          hover:bg-primary/90 transition
        "
      >
        {isValidated ? "Link Adapter →" : "Validate Credentials"}
      </button>

      {/* FOOTER */}
      <p className="text-muted-foreground text-xs text-center">
        🔒 Credentials are never stored insecurely.
      </p>
    </form>
  );
}

export default S3CredentialForm;