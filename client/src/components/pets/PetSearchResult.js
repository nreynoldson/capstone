import { Fragment, useCallback, useMemo } from 'react';
import { Link,  useNavigate } from 'react-router-dom';

import AnimalConsts from '../../consts/Animal';

import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Table from 'react-bootstrap/Table';
import Tooltip from 'react-bootstrap/Tooltip'

import { Check } from 'react-bootstrap-icons';
import { CircleFill } from 'react-bootstrap-icons';
import { XCircleFill } from 'react-bootstrap-icons';

import './css/PetSearchResult.css';

const PetSearchResult = (props) => {
  const navigate = useNavigate();

  const {
    age,
    availability,
    avatarUrl,
    breed,
    canDate,
    canDelete,
    canEdit,
    onEdit,
    dateInfo,
    disposition = [],
    gender,
    id,
    images = [],
    name,
    onDelete,
    shelterName,
    type,
    usePopover
  } = props;

  const handleDeleteClick = useCallback((evt) => {

    evt.preventDefault();
    evt.stopPropagation();
    onDelete(id, name, shelterName);
  }, [id, name, onDelete, shelterName]);

  const breedDisplay = useMemo(() => {
  
    let breedDisplay = AnimalConsts.typeToDisplayNameMap[type];
    if (type === 'dog' || type === 'cat') {
      const breedToDisplayNameMap = (type === 'dog') ?
        AnimalConsts.dogBreedsToDisplayNameMap :
        AnimalConsts.catBreedsToDisplayNameMap;

      breedDisplay = `${breedDisplay} (${breedToDisplayNameMap[breed]})`;
    }

    return breedDisplay;
  }, [breed, type]);

  const popover = useMemo(() => {

    const imageElements = null;
    // const imageElements = images.map(({ displayName, id, url }) => {

    //   return (
    //     <Image
    //       rounded
    //       className="m-2"
    //       key={id}
    //       src={url}
    //       title={displayName}
    //       height="100"
    //     />
    //   );
    // });

    const { dispositions } = AnimalConsts;
    const goodWithOtherAnimals = disposition.includes(dispositions.goodWithOtherAnimals);
    const goodWithChildren = disposition.includes(dispositions.goodWithChildren);
    const mustBeLeashed = disposition.includes(dispositions.mustBeLeashed);
    let goodWithOtherAnimalsRow = null;
    let goodWithChildrenRow = null;
    let mustBeLeashedRow = null;

    if (goodWithOtherAnimals) {
      goodWithOtherAnimalsRow = (
        <tr>
          <td><b>{AnimalConsts.dispositionToDisplayNameMap.goodWithOtherAnimals}</b></td>
          <td><Check size={25} color="green" /></td>
        </tr>
      );
    }

    if (goodWithChildren) {
      goodWithChildrenRow = (
        <tr>
          <td><b>{AnimalConsts.dispositionToDisplayNameMap.goodWithChildren}</b></td>
          <td><Check size={25} color="green" /></td>
        </tr>
      );
    }

    if (mustBeLeashed) {
      mustBeLeashedRow = (
        <tr>
          <td><b>{AnimalConsts.dispositionToDisplayNameMap.mustBeLeashed}</b></td>
          <td><Check size={25} color="red" /></td>
        </tr>
      );
    }

    return (
      <Popover id={`petProfileQuickView${id}`} className="petProfileQuickView">
        <Popover.Header as="h3" className="text-center">
          <b>{name}</b>
        </Popover.Header>
        <Popover.Body>
          <div className="d-flex flex-wrap flex-row mr-auto">
            {imageElements}
          </div>
          <Table className="petProfileQuickViewTable">
            <tbody>
              <tr>
                <td><b>Type</b></td>
                <td>{breedDisplay}</td>
              </tr>
              <tr>
                <td><b>Age</b></td>
                <td>{AnimalConsts.ageToDisplayNameMap[age]}</td>
              </tr>
              <tr>
                <td><b>Gender</b></td>
                <td>{AnimalConsts.genderToDisplayNameMap[gender]}</td>
              </tr>
              <tr>
                <td><b>Availability</b></td>
                <td>{AnimalConsts.availabilityToDisplayNameMap[availability]}</td>
              </tr>
              {goodWithOtherAnimalsRow}
              {goodWithChildrenRow}
              {mustBeLeashedRow}
            </tbody>
          </Table>
        </Popover.Body>
      </Popover>
    );
  }, [
    age,
    availability,
    breedDisplay,
    disposition,
    gender,
    id,
    images,
    name,
    usePopover
  ]);

  const componentOutput = useMemo(() => {

    let deleteButton = null;
    if (canDelete && onDelete) {
      deleteButton = (
        <Fragment>
          <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
            <XCircleFill
              className="deleteButton"
              color="darkRed"
              size={25}
              onClick={handleDeleteClick}
            />
          </OverlayTrigger>
          <CircleFill className="deleteButtonBackground" color="white" size={25} />
        </Fragment>
      );
    }

    let dateButton = null;
    if (canDate && !dateInfo) {
      dateButton = (
        <Link to={`/pet/${id}/request-date`}>
          <Button className="mt-2" size="sm" variant="date-pet">
            Request Date
          </Button>
        </Link>
      );
    }

    let editButton = null;
    if (canEdit && onEdit) {
      editButton = (
          <Button className="mt-2 edit-pet" size="sm" variant="secondary" onClick={(e)=> {e.stopPropagation(); onEdit(name)}}>
            Edit
          </Button>
      );
    }

    let dateInfoElement = null;
    if (dateInfo) {
      const dateDisplayOptions = ['en-us', { weekday:"short", year:"numeric", month:"short", day:"numeric"}];
      const startDate = new Date(dateInfo.startDate)
        .toLocaleDateString(...dateDisplayOptions);
      const endDate = new Date(dateInfo.endDate)
        .toLocaleDateString(...dateDisplayOptions);
      dateInfoElement = (
        <Link className="dateInfo mt-2" to={`/date/${id}/`}>
          Date scheduled:
          <br/>
          {startDate}{' - '}
          <br/>
          {endDate}
        </Link>
      );
    }

    return (
      <OverlayTrigger placement="auto" overlay={popover} trigger={usePopover ? ['hover', 'focus'] : []}>
        <div  className="d-flex flex-column petSearchResult" onClick={() => navigate(`/pet/${name}/${shelterName}`)}>
          <Image rounded className="avatar-card" src={avatarUrl || '/images/no_image.svg'} />
          <div className="flex-column align-items-center justify-content-between">
            <h3 className="petName">{name}</h3>
            <span>
              {AnimalConsts.ageToDisplayNameMap[age]} <b className="mr-1 ml-1">•</b> {breedDisplay}
            </span>
          </div>
          {deleteButton}
          {editButton}
          {dateButton}
          {dateInfoElement}
        </div>
      </OverlayTrigger>
    );
  }, [
    age,
    avatarUrl,
    breedDisplay,
    canDate,
    canDelete,
    canEdit,
    onEdit,
    dateInfo,
    handleDeleteClick,
    id,
    name,
    onDelete,
    popover,
    shelterName
  ]);

  if(usePopover)
    return (<OverlayTrigger placement="auto" overlay={popover}>{componentOutput}</OverlayTrigger>);
  else
    return componentOutput;
}

export default PetSearchResult;