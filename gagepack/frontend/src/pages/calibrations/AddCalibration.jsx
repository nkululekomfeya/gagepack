export function AddCalibration() {
    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Add Calibration</h1>
            <form className="space-y-4">
                <Input label="Calibration Date" />
                <Input label="Due Date" />
                <Input label="Performed By" />


                {/* External only */}
                <div>
                    <label className="block text-sm mb-1">Upload Certificate (PDF)</label>
                    <input type="file" />
                </div>


                {/* Internal only */}
                <Input label="Master Gauge Number" />
                <Input label="Target Value" />
                <Input label="Actual Value" />


                <select className="input">
                    <option>Pass</option>
                    <option>Fail</option>
                </select>


                <button className="btn-primary">Save Calibration</button>
            </form>
        </div>
    );
}