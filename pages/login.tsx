import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { FirebaseContext } from "@/context/FirebaseContext";
import { checkPassword } from "@/lib/helpers/fetch";
import { useContext, useState } from "react";
import { redirect } from "next/navigation";

const Login: React.FC = () => {
	const [password, setPassword] = useState<string>("");
	// const { startFirebaseInit } = useContext(FirebaseContext);
	const [failed, setFailed] = useState(false);
	const [success, setSuccess] = useState(true);
	const [loading, setLoading] = useState(false);

	const login = async () => {
		setSuccess(false);
		setFailed(false);
		setLoading(true);

		const loginResult = await checkPassword({ input: password });

		if (loginResult.status === 200) {
			setSuccess(true);
			setLoading(false);
			setTimeout(() => {
				// startFirebaseInit();
			}, 1000);
		} else {
			setFailed(true);
			setLoading(false);
		}
	};

	return (
		<div className="login min-h-80vh flex justify-center items-center">
			<div className="max-w-144 px-6 lg:px-12 flex flex-col justify-center">
				<h1 className="uppercase text-2xl lg:text-4xl mb-4 text-center">
					Greetings!
				</h1>
				<p className="text-lg lg:text-xl">Do you have a password?</p>
				<div className="mt-10">
					<form>
						{
							<Input
								label="Password"
								type="password"
								className="mb-10"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						}

						<div className="flex flex-col items-center">
							<div className="mb-6 text-center">
								<Button
									label={loading ? "Logging in…" : "Log in"}
									onClick={() => login()}
								/>
								{failed && (
									<p className="mt-4">
										Sorry, that&apos;s not right. Please try again.
									</p>
								)}
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
