import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Gallery from '../pages/Gallery';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Upload from '../pages/Upload';
import MainLayout from '../layouts/MainLayout';
import NoPageFound from '../pages/NoPageFound';
import ProtectedRoute from '@/components/ProtectedRoutes';
import Invite from '@/pages/Invite';
import Pricing from '@/pages/Pricing';
import ContactUs from '@/pages/ContactUs';

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
				<Route
					path="invite"
					element={
						<ProtectedRoute>
							<Invite />
						</ProtectedRoute>
					}
				/>
				<Route
					path="pricing"
					element={
						<ProtectedRoute>
							<Pricing />
						</ProtectedRoute>
					}
				/>
				<Route path="contact" element={<ContactUs />} />

				<Route path="*" element={<NoPageFound />} />
			</Route>
		</Routes>
	);
};

export default MainRoutes;
