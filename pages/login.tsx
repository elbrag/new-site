import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const Login: React.FC = () => {
	const login = (e: any) => {
		e.preventDefault();
		console.log("login");
	};

	return (
		<div className="login min-h-80vh flex justify-center items-center">
			<div className="max-w-144 px-6 lg:px-12">
				<h1 className="uppercase text-2xl lg:text-4xl mb-10">
					Log in to play!
				</h1>
				<div>
					<form onSubmit={(e) => login(e)}>
						<Input label="Username" className="mb-6" />
						<Input label="Password" type="password" className="mb-10" />

						<div className="flex flex-col items-center">
							<div className="mb-6">
								<Button label="Log in" isSubmit={true} />
							</div>
							<Button label="Sign up" href="/signup" buttonStyle="link" />
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
