import { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { v4 } from 'uuid';
import { storage } from './firebase-config';
import './App.css';

function App() {
	const [imageUpload, setImageUpload] = useState(null);
	const [imageUrls, setImageUrls] = useState([]);
	const imagesListRef = ref(storage, 'images/');

	const uploadFile = () => {
		if (imageUpload == null) return;

		const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
		uploadBytes(imageRef, imageUpload).then(snapshot => {
			getDownloadURL(snapshot.ref).then(url => {
				setImageUrls(prev => [...prev, url]);
			});
		});
	};

	useEffect(() => {
		listAll(imagesListRef).then(res => {
			res.items.forEach(item => {
				getDownloadURL(item).then(url => {
					setImageUrls(prev => [...prev, url]);
				});
			});
		});
	}, []);

	return (
		<div className='App'>
			<input
				type='file'
				onChange={event => {
					setImageUpload(event.target.files[0]);
				}}
			/>
			<button onClick={uploadFile}> Upload Image</button>
			{imageUrls.map(url => (
				<img key={v4()} src={url} alt='' />
			))}
		</div>
	);
}

export default App;
