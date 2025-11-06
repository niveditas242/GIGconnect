import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function PasswordFlow() {
  const [code, setCode] = useState("");
  const { setUserId } = useContext(AuthContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    setUserId(e.target.value); // store in context
  };

  return (
    <div>
      <h2>Enter OTP</h2>
      <input value={code} onChange={handleChange} placeholder="OTP" />
    </div>
  );
}
