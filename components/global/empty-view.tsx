interface EmptyViewProps {
  text: string;
}

export default function EmptyView({ text }: EmptyViewProps) {
  return <div className="label-2 text-gray-400 w-full text-center">{text}</div>;
}
