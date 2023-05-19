import { useEffect, useState } from "react";

import "../styles/css/TrainingReport.css";

export default function TrainingReport() {
    const [report, setreport] = useState(null);

	useEffect(() => {

        // todo load report

    }, []);

	return <div className="training-report">
        <h1>training report</h1>
    </div>;
}
