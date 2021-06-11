import React from 'react';
import { Button, } from 'reactstrap';
import { isEmpty, get, sumBy, isString, last, sortBy, omit } from 'lodash';
import { toast } from 'react-toastify';
import { useToggle } from 'react-use';
import classnames from 'classnames';

import firebase from '../../firebase';
import { userFields } from '../../shared/models/mission';
import useCollectionSubscription from '../hooks/useCollectionSubscription';
import useDocumentSubscription from '../hooks/useDocumentSubscription';
import ModelFormModal from '../modals/ModelFormModal';
import EditButton from '../EditButton';

const storageRef = firebase.storage().ref();
const db = firebase.firestore();
const missionsRef = db.collection('missions');
const missionsSettingRef = db.collection('settings').doc('missions');

export default function Missions(props) {
  const { match: { params: { companyId } } } = props;
  const missions = useCollectionSubscription(missionsRef.orderBy('createdAt'));
  const missionsSetting = useDocumentSubscription(missionsSettingRef);
  const currentPoint = sumBy(missions.filter(_ => _.status === 'completed'), 'point') - get(missionsSetting, 'usedPoint', 0);

  return (
    <div className="company-custom-sections">
      <div className="container py-5">
        <div className="d-flex justify-content-center mb-1">
          <h3>はるきのミッション</h3>
        </div>
        <div className="d-flex justify-content-end mb-5">
          <div>
            <span>現在のポイント: </span>
            <span className="text-info font-weight-bold" style={{ fontSize: 60, }}>{currentPoint}</span>
          </div>
        </div>
        <div className="d-flex flex-wrap justify-content-around">
          {
            missions.map((mission) => {
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
