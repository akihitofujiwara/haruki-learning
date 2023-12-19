import React, { Fragment } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter, Form, FormGroup, Input, Label } from 'reactstrap';
import { keyBy, isEmpty, get, sumBy, isString, last, sortBy, omit } from 'lodash';
import { toast } from 'react-toastify';
import { useToggle } from 'react-use';
import classnames from 'classnames';
import { format as formatDate } from 'date-fns';
import numeral from 'numeral';

import firebase from '../../firebase';
import { userFields } from '../../shared/models/mission';
import { statuses as giftStatuses } from '../../shared/models/gift';
import useCollectionSubscription from '../hooks/useCollectionSubscription';
import useDocumentSubscription from '../hooks/useDocumentSubscription';
import useQueryParams from '../hooks/useQueryParams';
import ModelFormModal from '../modals/ModelFormModal';
import EditButton from '../EditButton';
import QueryBoolean from '../QueryBoolean';

const storageRef = firebase.storage().ref();
const db = firebase.firestore();
const missionsRef = db.collection('missions');
const giftTypesRef = db.collection('giftTypes');
const giftsRef = db.collection('gifts');

export default function Missions(props) {
  const { match: { params: { companyId } } } = props;
  const queryParams = useQueryParams();
  const missions = useCollectionSubscription(missionsRef.orderBy('createdAt'));
  const giftTypes = useCollectionSubscription(giftTypesRef.orderBy('createdAt'));
  const giftTypesById = keyBy(giftTypes, 'id');
  const gifts = useCollectionSubscription(giftsRef.orderBy('createdAt'));
  let filteredItems = missions;
  if(queryParams.showsAll !== '1') {
    filteredItems = filteredItems.filter(_ => _.status !== 'completed');
  }
  const currentPoint = sumBy(missions.filter(_ => _.status === 'completed'), 'point') - sumBy(gifts, _ => get(giftTypesById, [_.giftTypeId, 'point'], 0));

  return (
    <div className="company-custom-sections">
      <div className="container py-5">
        <div className="mb-4 d-flex justify-content-center mb-1">
          <h3>はるきのミッション</h3>
        </div>
        <div className="d-flex align-items-end justify-content-center mb-3">
          <div>
            <span>現在のポイント: </span>
            <span className="text-info font-weight-bold" style={{ fontSize: 60, lineHeight: 1, }}>{currentPoint}</span>
          </div>
        </div>
        <div className="d-flex align-items-end justify-content-center mb-5">
          <div>
            <GiftButton {...{ giftTypes, gifts, currentPoint, }} />
            <GiftHistoryButton {...{ giftTypes, giftTypesById, gifts, currentPoint, }} />
          </div>
        </div>
        <div className="d-flex align-items-end justify-content-center mb-5">
          <QueryBoolean paramName="showsAll" label="クリア済みも表示" defaultValue={'0'} />
        </div>
        <div className="d-flex flex-wrap justify-content-around">
          {
            filteredItems.map((mission) => {
              const { id, ref, body, image, point, status = 'initial', } = mission;
              const processValues = async (values) => {
                const { image } = values;
                if(image == null) return values;

                const imageRef = storageRef.child(`missions/${id}/image`);
                let imageUrl;
                if(isString(image)) {
                  imageUrl = image;
                } else {
                  await imageRef.put(image, { contentType: image.type });
                  imageUrl = await imageRef.getDownloadURL();
                }
                return { ...values, image: imageUrl, };
              };

              return (
                <div key={id} className={classnames('position-relative card mb-3', { 'border-success': status === 'completed', 'border-secondary': status === 'initial' })} style={{ width: 300, }}>
                  {
                    !isEmpty(image) ? (
                      <img className="card-img-top" src={image} height={200}/>
                    ) : (
                      <svg className="bd-placeholder-img card-img-top" width="100%" height="200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Image cap">
                        <title>Placeholder</title>
                        <rect width="100%" height="100%" fill="#868e96"/>
                      </svg>
                    )
                  }
                  <div className="card-body" style={{ opacity: status === 'completed' && 0.3 }}>
                    <div className="card-title">
                      {body}
                    </div>
                    <div className="card-text">
                      <span className="text-info font-weight-bold mr-2" style={{ fontSize: 50 }}>{point}</span>
                      ポイント
                    </div>
                    <div>
                      <EditButton outline color="primary" itemRef={ref} FormModal={ModelFormModal} label={<span className="fas fa-image" />} formProps={{ title: '写真を送る', fields: userFields() }} beforeSubmit={processValues} />
                    </div>
                  </div>
                  {
                    status === 'completed' && (
                      <div className="position-absolute d-flex justify-content-center align-items-center" style={{ top: 0, right: 0, bottom: 0, left: 0}}>
                        <div className="bg-white p-2 border border-danger rounded text-danger font-weight-bold">
                          クリア済み
                        </div>
                      </div>
                    )
                  }
                </div>
              );
            })
          }
        </div>
      </div>
    </div>
  );
}

function GiftButton (props) {
  const { giftTypes, gifts, currentPoint } = props;
  const [showsModal, toggleModal] = useToggle(false);

  return (
    <Fragment>
      <Button color="primary" onClick={toggleModal.bind(null, true)}>
        <span className="fas fa-gift mr-1" />
        プレゼントをもらう
      </Button>
      <Modal isOpen={showsModal}>
        <ModalHeader>
          プレゼント
        </ModalHeader>
        <ModalBody>
          <div>
            {
              giftTypes.map((giftType) => {
                const { id, name, point } = giftType;
                const isGettable = currentPoint >= point;

                const onClick = async () => {
                  if(!isGettable) return toast.error('ポイントが足りません');
                  if(!window.confirm('本当にこれをもらいますか？')) return;

                  await giftsRef.add({
                    giftTypeId: id,
                    status: 'initial',
                    createdAt: new Date(),
                  });
                  toast.success('プレゼントをリクエストしました');
                }

                return (
                  <div key={id} className="card p-3 mb-2" style={{ fontSize: 20, opacity: !isGettable && 0.5, }} onClick={onClick}>
                    <div className="d-flex align-items-center justify-content-between" style={{ fontSize: 20 }}>
                      <div>
                        {name}
                      </div>
                      <div>
                        <span className="text-info font-weight-bold" style={{ fontSize: 40, }}>
                          {numeral(point).format()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="cancel" color="secondary" onClick={toggleModal.bind(null, false)}>閉じる</Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
}

function GiftHistoryButton (props) {
  const { giftTypes, giftTypesById, gifts, currentPoint } = props;
  const [showsModal, toggleModal] = useToggle(false);

  return (
    <Fragment>
      <Button className="ml-2" outline color="info" onClick={toggleModal.bind(null, true)}>
        <span className="fas fa-history mr-1" />
        りれき
      </Button>
      <Modal isOpen={showsModal}>
        <ModalHeader>
          プレゼントのりれき
        </ModalHeader>
        <ModalBody>
          <div>
            {
              gifts.map((gift) => {
                const { id, giftTypeId, status = 'initial', createdAt, } = gift;
                const giftType = giftTypesById[giftTypeId];
                const { label: statusLabel, color } = giftStatuses[status];

                return (
                  <div key={id} className="card p-2 mb-2" style={{ fontSize: 20, }}>
                    <div className="text-muted mb-2" style={{ fontSize: '60%', }}>
                      {formatDate(createdAt.toDate(), 'yyyy/MM/dd HH:mm:ss')}
                    </div>
                    <div className="d-flex align-items-center justify-content-between" style={{ fontSize: 20 }}>
                      <div>
                        {giftType && giftType.name}
                      </div>
                      <div>
                        {giftType && numeral(giftType.point).format()}
                      </div>
                      <div className={classnames(`text-${color}`)}>
                        {giftStatuses[status].label}
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="cancel" color="secondary" onClick={toggleModal.bind(null, false)}>閉じる</Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
}
