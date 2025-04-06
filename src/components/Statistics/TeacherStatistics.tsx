import { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

interface TeacherStatisticsProps {
    courseId: number;
}

const TeacherStatistics = ({ courseId }: TeacherStatisticsProps) => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStatistics() {
            try {
                const response = await fetch(`/api/statistics/teacher?courseId=${courseId}`);
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
    }, [courseId]);

    if (loading) {
        return <div>Loading statistics...</div>;
    }

    if (!stats) {
        return <div>Failed to load statistics</div>;
    }

    const scoreDistribution = {
        labels: ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'],
        datasets: [
            {
                label: 'Score Distribution',
                data: stats.scoreDistribution,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 205, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                ],
            },
        ],
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Statistika kurzu</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600">Počet studentů</p>
                    <p className="text-2xl font-bold">{stats.enrolledStudents}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600">Průměrné skóre</p>
                    <p className="text-2xl font-bold">{stats.averageScore}%</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600">Dokončeno testů</p>
                    <p className="text-2xl font-bold">{stats.completedQuizzes}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold mb-2">Distribuce skóre</h3>
                    <div className="h-64">
                        <Bar
                            data={scoreDistribution}
                            options={{
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">Úspěšnost podle lekcí</h3>
                    <div className="h-64">
                        <Pie
                            data={{
                                labels: stats.quizNames,
                                datasets: [{
                                    data: stats.quizScores,
                                    backgroundColor: [
                                        'rgba(54, 162, 235, 0.6)',
                                        'rgba(75, 192, 192, 0.6)',
                                        'rgba(255, 205, 86, 0.6)',
                                        'rgba(255, 159, 64, 0.6)',
                                        'rgba(255, 99, 132, 0.6)',
                                    ]
                                }]
                            }}
                            options={{ maintainAspectRatio: false }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherStatistics;