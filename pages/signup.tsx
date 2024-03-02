import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const Signup: React.FC = () => {
	const signup = (e: any) => {
		e.preventDefault();
		console.log("signup");
	};

	return (
		<div className="signup min-h-80vh flex justify-center items-center">
			<div className="max-w-144 px-6 lg:px-12">
				<h1 className="uppercase text-2xl lg:text-4xl mb-10">
					Sign up to play!
				</h1>
				<div>
					<form onSubmit={(e) => signup(e)}>
						{/* <Input label="Username" className="mb-6" />
						<Input label="Password" type="password" className="mb-6" />
						<Input label="Password again" type="password" className="mb-10" /> */}

						<div className="flex flex-col items-center">
							<div className="mb-6">
								<Button label="Sign up" isSubmit={true} />
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Signup;
