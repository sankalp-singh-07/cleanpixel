import Footer from '@/components/Footer';
import Header from '@/components/Header';
import PictureGallery from '@/components/PictureGallery';
import RemoveBtnPart from '@/components/RemoveBtnPart';
import Testimonials from '@/components/Testimonials';


const Home = () => {
	return (
		<>
			<Header />
			<Testimonials />
			<PictureGallery />
			<RemoveBtnPart />
			<Footer />
		</>
	);
};

export default Home;
