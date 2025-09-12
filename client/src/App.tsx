import { useEffect } from 'react';
import useAuth from './hooks/useAuth';
import MainRoutes from './routes/MainRoutes';
import { ToastContainer } from 'react-toastify';

function App() {
	const { hydrateUser } = useAuth();

	useEffect(() => {
		hydrateUser();
	}, []);

	return (
		<>
			<MainRoutes />
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				pauseOnFocusLoss
				pauseOnHover
				draggable
				theme="light"
			/>
		</>
	);
}

export default App;
