import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Gallery from '../pages/Gallery';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Upload from '../pages/Upload';
import MainLayout from '../layouts/MainLayout';
import NoPageFound from '../pages/NoPageFound';
import ProtectedRoute from '@/components/ProtectedRoutes';

const MainRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<MainLayout />}>
				<Route index element={<Home />} />
				<Route path="register" element={<Register />} />
				<Route path="login" element={<Login />} />

				<Route
					path="gallery"
					element={
						<ProtectedRoute>
							<Gallery />
						</ProtectedRoute>
					}
				/>
				<Route
					path="upload"
					element={
						<ProtectedRoute>
							<Upload />
						</ProtectedRoute>
					}
				/>

				<Route path="*" element={<NoPageFound />} />
			</Route>
		</Routes>
	);
};

export default MainRoutes;
