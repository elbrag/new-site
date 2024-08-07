import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { checkPassword } from "@/lib/helpers/fetch";
import { useState } from "react";

const Login: React.FC = () => {
	const [password, setPassword] = useState<string>("");

	const login = async () => {
		const loginResult = await checkPassword({ input: password });
		if (loginResult.status === 200) {
			// asyncInitFirebase();
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
							/* <Input label="Username" className="mb-6" />*/
							<Input
								label="Password"
								type="password"
								className="mb-10"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						}

						<div className="flex flex-col items-center">
							<div className="mb-6">
								<Button label="Log in" onClick={() => login()} />
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
