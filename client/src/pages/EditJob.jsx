import { useParams } from "react-router-dom";

export default function EditJob() {
    const { jobId } = useParams();
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Edit Job {jobId}</h1>
        </div>
    );
}
