import {useState, useEffect} from 'react';
import {Line} from 'react-chartjs-2';
import {Chart as ChartJS, registerables} from 'chart.js';

ChartJS.register(...registerables);

interface StudentStatisticsProps {
    courseId: number;
    studentId: number;
}

const StudentStatistics = ({courseId, studentId}: StudentStatisticsProps) => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStatistics() {
            try {
                const response = await fetch(`/api/statistics/student?courseId=${courseId}&studentId=${studentId}`);
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Error fetching statistics:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchStatistics();
    }, [courseId, studentId]);

    if (loading) {
        return <div>Loading your progress...</div>;
    }

    if (!stats) {
        return <div>Failed to load statistics</div>;
    }

    const progressData = {
        labels: stats.quizNames,
        datasets: [
            {
                label: 'Vaše skóre',
                data: stats.scores,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Průměrné skóre',
                data: stats.averageScores,
                borderColor: 'rgba(153, 102, 255, 1)',
                borderDash: [5, 5],
                fill: false,
            },
        ],
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Vaše statistika</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600">Dokončené testy</p>
                    <p className="text-2xl font-bold">{stats.completedQuizzes}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600">Průměrné skóre</p>
                    <p className="text-2xl font-bold">{stats.averageScore}%</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600">Nejlepší výsledek</p>
                    <p className="text-2xl font-bold">{stats.bestScore}%</p>
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-2">Vaše výsledky po lekcích</h3>
                <div className="h-64">
                    <Line
                        data={progressData}
                        options={{
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    min: 0,
                                    max: 100,
                                    title: {
                                        display: true,
                                        text: 'Skóre (%)'
                                    }
                                }
                            }
                        }}
                    />
                </div>
            </div>

            <div className="mt-6">
                <h3 className="font-semibold mb-2">Přehled testů</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Název</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skóre</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {stats.quizResults.map((result: any) => (
                            <tr key={result.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{result.quizName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(result.dateTaken).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                        result.score >= 80 ? 'bg-green-100 text-green-800' :
                            result.score >= 60 ? 'bg-blue-100 text-blue-800' :
                                result.score >= 40 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                    }`}>
                      {result.score}%
                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentStatistics;