import classNames from 'classnames/bind';

import styles from './CommentInput.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faPaperPlane, faSmile } from '@fortawesome/free-solid-svg-icons';
import { useContext, useState } from 'react';
import { AuthContext } from '~/context/AuthContext';
import Vote from '~/components/Rating/Vote/Vote';
import showToast from "~/components/message";
import axios from 'axios';

const cx = classNames.bind(styles);

const CommentInput = ({ productId, onUpload }) => {
    const { userId } = useContext(AuthContext);
    const [rate, setRate] = useState(0);
    const [comment, setComment] = useState('');
    const [image, setImage] = useState(null);


    const hanldeSendComment = async () => {
        try {
            const formData = new FormData();
            formData.append('product_id', productId);
            formData.append('user_id', userId);
            formData.append('rating', rate);
            formData.append('comment', comment);

            formData.append('image', image);

            const response = await axios.post('/api/review/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response);
            if (response.status === 201) {

                showToast('Đã thêm đánh giá');
                setRate(0);
                setComment('');
                setImage(null);
                onUpload();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={cx('comment-input')}>
            <input
                type="text"
                name="comment"
                id="comment"
                placeholder="Đánh giá sản phẩm"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <div className={cx('image-preview')}>
                {image ? (
                    <img src={URL.createObjectURL(image)} alt="image-preview" />
                ) : (
                    <div className={cx('image-preview-box')}>Thêm ảnh</div>
                )}
            </div>

            <div className={cx('rating')}>
                <Vote rate={rate} setRate={setRate} />
            </div>


            <label htmlFor="image-input" className={cx('camera')}>
                <FontAwesomeIcon icon={faCamera} />
                <input
                    name="image-input"
                    id="image-input"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            setImage(file);
                        }
                    }}
                    type="file"
                    hidden
                />
            </label>

            <div className={cx('submit-btn')} onClick={hanldeSendComment}>
                <FontAwesomeIcon icon={faPaperPlane} />
            </div>

        </div>
    );
};

export default CommentInput;
