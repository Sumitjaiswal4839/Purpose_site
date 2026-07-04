import React, { useState } from "react";
import { User, Heart, Mail, MapPin, AlertCircle } from "lucide-react";

interface BasicsFormProps {
  formData: {
    yourName: string;
    partnerName: string;
    customerEmail: string;
    location: string;
  };
  updateFormData: (data: any) => void;
  onNext: () => void;
}

const BasicsForm: React.FC<BasicsFormProps> = ({ formData, updateFormData, onNext }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (data: typeof formData) => {
    const e: Record<string, string> = {};
    if (!data.yourName.trim()) e.yourName = "Apna naam toh batao 😊";
    else if (data.yourName.trim().length < 2) e.yourName = "Naam thoda lamba chahiye";
    if (!data.partnerName.trim()) e.partnerName = "Partner ka naam batao 💕";
    else if (data.partnerName.trim().length < 2) e.partnerName = "Naam thoda lamba chahiye";
    if (!data.customerEmail.trim()) e.customerEmail = "Email required hai — link yahin aayega";
    else if (!/\S+@\S+\.\S+/.test(data.customerEmail)) e.customerEmail = "Valid email dalo";
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    updateFormData({ [e.target.name]: e.target.value });
    if (touched[e.target.name]) {
      setErrors(validate(updated));
    }
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(formData));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = { yourName: true, partnerName: true, customerEmail: true };
    setTouched(allTouched);
    const errs = validate(formData);
    setErrors(errs);
    if (Object.keys(errs).length === 0) onNext();
  };

  const fields = [
    {
      name: "yourName",
      label: "Your Name",
      placeholder: "e.g. Rahul",
      icon: <User className="w-5 h-5" />,
      type: "text",
    },
    {
      name: "partnerName",
      label: "Partner's Name",
      placeholder: "e.g. Priya",
      icon: <Heart className="w-5 h-5 text-rose-400" />,
      type: "text",
    },
    {
      name: "customerEmail",
      label: "Your Email",
      placeholder: "Secret link yahaan aayega",
      icon: <Mail className="w-5 h-5" />,
      type: "email",
    },
    {
      name: "location",
      label: "Your City (Optional)",
      placeholder: "e.g. Delhi, Mumbai...",
      icon: <MapPin className="w-5 h-5" />,
      type: "text",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-7 max-w-xl mx-auto w-full">
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 font-serif tracking-tight">
          Basics ✍️
        </h2>
        <p className="text-gray-400 font-medium text-sm leading-relaxed">
          Fill in the essentials to begin your cinematic journey.
        </p>
      </div>

      <div className="space-y-5">
        {fields.map((field) => {
          const hasError = touched[field.name] && errors[field.name];
          const isValid = touched[field.name] && !errors[field.name] && formData[field.name as keyof typeof formData];
          return (
            <div key={field.name}>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                {field.label}
              </label>
              <div className="relative">
                <span
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                    hasError ? "text-red-400" : isValid ? "text-rose-400" : "text-gray-300"
                  }`}
                >
                  {field.icon}
                </span>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                  onBlur={() => handleBlur(field.name)}
                  className={`w-full bg-gray-50 border-2 rounded-2xl pl-12 pr-4 py-4 text-base font-semibold focus:bg-white focus:ring-4 outline-none transition-all ${
                    hasError
                      ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                      : isValid
                      ? "border-rose-300 focus:border-rose-400 focus:ring-rose-50"
                      : "border-gray-100 focus:border-rose-300 focus:ring-rose-50"
                  }`}
                />
                {isValid && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-400 text-lg">✓</span>
                )}
              </div>
              {hasError && (
                <p className="flex items-center gap-1.5 text-red-500 text-xs font-semibold mt-1.5 ml-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {errors[field.name]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-black hover:scale-[1.02] active:scale-95 shadow-xl transition-all flex items-center justify-center gap-3 group mt-4"
      >
        Next Step{" "}
        <span className="group-hover:translate-x-2 transition-transform text-xl">→</span>
      </button>

      <p className="text-center text-xs text-gray-400">
        🔒 Your data is encrypted and never shared.
      </p>
    </form>
  );
};

export default BasicsForm;
