import { useEffect } from 'react';
import useAuth from './hooks/useAuth';
import MainRoutes from './routes/MainRoutes';

function App() {
	const { hydrateUser } = useAuth();

	useEffect(() => {
		hydrateUser();
	}, []);

	return (
		<>
			<MainRoutes />
		</>
	);
}

export default App;
