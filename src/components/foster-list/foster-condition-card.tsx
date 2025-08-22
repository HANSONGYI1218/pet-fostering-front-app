import { useState } from 'react';
import {
  ANIMAL_GENDER_LABEL_KO,
  ANIMAL_SIZE_LABEL_KO,
  ANIMAL_TYPE_LABEL_KO,
} from '@/constants/enum';
import { AnimalGender, AnimalSize, AnimalType } from '@/types/animal/animal';
import ConditionItem from '../common/condition-types';

/**
 * @file [training-center] training-center 파일 안에 Training-center_Condition Card 컴포넌트
 * @description 훈련소의 조건을 필터링하는 컴포넌트입니다.
 * @author 'HANSONGYI'
 */

export default function FosterConditionCard({
  animalType,
  animalSize,
  animalGender,
  setAnimalType,
  setAnimalSize,
  setAnimalGender,
}: {
  animalType: string;
  animalSize: string;
  animalGender: string;
  setAnimalType: (value: string) => void;
  setAnimalSize: (value: string) => void;
  setAnimalGender: (value: string) => void;
}) {
  const [isSelected, setIsSelected] = useState(false);

  const conditionTypes = [
    {
      title: '종류',
      checkboxItems: [
        {
          key: '전체',
          value: 'type_all',
        },
        {
          key: ANIMAL_TYPE_LABEL_KO[AnimalType.DOG],
          value: 'dog',
        },
        {
          key: ANIMAL_TYPE_LABEL_KO[AnimalType.CAT],
          value: 'cat',
        },
      ],
      default: animalType,
      onchange: setAnimalType,
    },
    {
      title: '사이즈',
      checkboxItems: [
        {
          key: '전체',
          value: 'size-all',
        },
        {
          key: ANIMAL_SIZE_LABEL_KO[AnimalSize.SMALL],
          value: 'small',
        },
        {
          key: ANIMAL_SIZE_LABEL_KO[AnimalSize.MEDIUM],
          value: 'medium',
        },
        {
          key: ANIMAL_SIZE_LABEL_KO[AnimalSize.LARGE],
          value: 'large',
        },
      ],
      default: animalSize,
      onchange: setAnimalSize,
    },
    {
      title: '성별',
      checkboxItems: [
        {
          key: '전체',
          value: 'gender_all',
        },
        {
          key: ANIMAL_GENDER_LABEL_KO[AnimalGender.MALE],
          value: 'male',
        },
        {
          key: ANIMAL_GENDER_LABEL_KO[AnimalGender.FEMALE],
          value: 'female',
        },
      ],
      default: animalGender,
      onchange: setAnimalGender,
    },
  ];

  return (
    <ConditionItem
      conditionTypes={conditionTypes}
      isSelected={isSelected}
      setIsSelected={setIsSelected}
    />
  );
}
