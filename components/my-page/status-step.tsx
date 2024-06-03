interface StatusStepProps {
	status: string;
}

const statusMap: { [key: string]: string[] } = {
	"신청 완료": [
		"bg-blue-100 text-gray-500",
		"bg-white text-gray-300",
		"bg-white text-gray-300",
	],
	"승인 확인 중": [
		"bg-white text-gray-300",
		"bg-blue-800 text-white",
		"bg-white text-gray-300",
	],
	"승인 완료": [
		"bg-white text-gray-300",
		"bg-white text-gray-300",
		"bg-blue-100 text-gray-500",
	],
};

const StatusStep: React.FC<StatusStepProps> = ({ status }) => {
	console.log(status);
	const [step1, step2, step3] = statusMap[status] || statusMap["신청 완료"];

	return (
		<div className="flex items-center space-x-4 w-full p-4 justify-center">
			<div className={`px-4 py-2 rounded-full ${step1}`}>
				<span>신청 완료</span>
			</div>
			<span className="text-gray-400">{">"}</span>
			<div className={`px-4 py-2 rounded-full ${step2}`}>
				<span>승인 확인 중</span>
			</div>
			<span className="text-gray-400">{">"}</span>
			<div className={`px-4 py-2 rounded-full ${step3}`}>
				<span>승인 완료</span>
			</div>
		</div>
	);
};

export default StatusStep;
