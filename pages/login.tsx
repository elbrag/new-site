import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { FirebaseContext } from "@/context/FirebaseContext";
import { CookieNames, getCookie } from "@/lib/helpers/cookies";
import { checkPassword } from "@/lib/helpers/fetch";
import { firebaseAdmin } from "@/lib/helpers/firebaseAdmin";
import { useRouter } from "next/navigation";
import {
	GetServerSidePropsContext,
	GetServerSidePropsResult,
} from "next/types";
import { FormEvent, useContext, useEffect, useState } from "react";

const Login: React.FC = () => {
	const router = useRouter();
	const [password, setPassword] = useState<string>("");
	const [honey, setHoney] = useState<string>("");
	const { initFirebase, signedIn } = useContext(FirebaseContext);
	const [failed, setFailed] = useState(false);
	const [success, setSuccess] = useState(true);
	const [loading, setLoading] = useState(false);
	const [mimickActive, setMimickActive] = useState(false);

	useEffect(() => {
		if (signedIn) router.push("/");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [signedIn]);

	const login = async () => {
		if (honey.length) return;
		setSuccess(false);
		setFailed(false);
		setLoading(true);

		const loginResult = await checkPassword({ input: password });

		if (loginResult.status === 200) {
			setSuccess(true);
			initFirebase(true);
			setTimeout(() => {
				router.push("/");
				setLoading(false);
			}, 1000);
		} else {
			setFailed(true);
			setLoading(false);
		}
	};

	return (
		<div className="login min-h-80vh flex justify-center items-center">
			<div className="max-w-144 px-6 lg:px-12 flex flex-col justify-center">
				<div className="text-center">
					<h1 className="uppercase text-2xl lg:text-4xl mb-4">Greetings!</h1>
					<p className="text-lg lg:text-xl">Do you have a password?</p>
				</div>
				<div className="mt-10">
					<form
						onSubmit={(e: FormEvent) => {
							e.preventDefault();
							login();
						}}
					>
						{
							<>
								<Input
									label="Password"
									type="password"
									className="mb-10"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									onClickEnter={login}
									setMimickActive={setMimickActive}
								/>
								<input
									className="hidden"
									value={honey}
									onChange={(e) => setHoney(e.target.value)}
								/>
							</>
						}

						<div className="flex flex-col items-center">
							<div className="mb-6 text-center">
								<Button
									label={loading ? "Logging in…" : "Log in"}
									onClick={() => login()}
									mimickActive={mimickActive}
									mimickHover={password?.length > 0}
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

export const getServerSideProps = async (
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<unknown>> => {
	const { req, res } = context;
	const cookieString =
		getCookie(CookieNames.FirebaseToken, req.headers.cookie ?? "") ?? "";

	let token = null;

	try {
		token = cookieString?.length
			? await firebaseAdmin?.auth()?.verifyIdToken(cookieString)
			: null;

		if (cookieString && !token) {
			res.setHeader(
				"Set-Cookie",
				`${CookieNames.FirebaseToken}=; Max-Age=0; path=/`
			);
			return {
				redirect: {
					destination: "/login",
					permanent: false,
				},
			};
		}
	} catch (e) {
		console.error("Error checking token: ", e);
		res.setHeader(
			"Set-Cookie",
			`${CookieNames.FirebaseToken}=; Max-Age=0; path=/`
		);
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}

	if (token) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	return {
		props: {},
	};
};
