import classNames from 'classnames/bind';

import styles from './CommentInput.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faPaperPlane, faSmile } from '@fortawesome/free-solid-svg-icons';
import EmojiPicker from 'emoji-picker-react';
import { useContext, useState } from 'react';
import { AuthContext } from '~/context/AuthContext';
import Vote from '~/components/Rating/Vote/Vote';
import axios from 'axios';

const cx = classNames.bind(styles);

const CommentInput = ({ productId, onUpload }) => {
    const { userId } = useContext(AuthContext);
    const [rate, setRate] = useState(0);
    const [comment, setComment] = useState('');
    const [image, setImage] = useState(null);

    // const handleEmojiClick = (event, emojiObject) => {
    //     console.log(emojiObject);
    //     setComment((prevComment) => prevComment + emojiObject.emoji);
    //     setShowEmojiPicker(false);
    // };

    // const handleToggleEmojiPicker = () => {
    //     setShowEmojiPicker(!showEmojiPicker);
    // };

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
                alert('コメントを追加しました。');
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
                placeholder="Lovely!"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <div className={cx('image-preview')}>
                {image ? (
                    <img src={URL.createObjectURL(image)} alt="image-preview" />
                ) : (
                    <div className={cx('image-preview-box')}>画像</div>
                )}
            </div>

            <div className={cx('rating')}>
                <Vote rate={rate} setRate={setRate} />
            </div>

            {/* <div className={cx('smile')} onClick={handleToggleEmojiPicker}>
                <FontAwesomeIcon icon={faSmile} />
            </div> */}

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

            {/* {showEmojiPicker && (
                <div
                    style={{
                        position: 'absolute',
                        zIndex: '1000',
                        top: '50px',
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        padding: '10px',
                        borderRadius: '8px',
                    }}
                >
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
            )} */}
        </div>
    );
};

export default CommentInput;
