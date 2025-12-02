import React from 'react';
import NavbarControl from '../../Components/NavbarColorControl/NavbarControl';
import BannerColorControl from '../../Components/BannerColorControl/BannerColorControl';
import CountColorControl from '../../Components/CountColorControl/CountColorControl';
import CategoryColorControl from '../../Components/CategoryColorControl/CategoryColorControl';
import SubCategoryColorControl from '../../Components/SubCategoryColorControl/SubCategoryColorControl';

const ColorControl = () => {
    return (
        <div className='grid grid-cols-3'>
            <NavbarControl></NavbarControl>
            <BannerColorControl></BannerColorControl>
            <CountColorControl></CountColorControl>
            <CategoryColorControl></CategoryColorControl>
            <SubCategoryColorControl></SubCategoryColorControl>
        </div>
    );
};

export default ColorControl;