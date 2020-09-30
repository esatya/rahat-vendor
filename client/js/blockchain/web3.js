/* global Web3 */
import AppSettings from '../settings/app';

const httpProvider = 'https://rumsannetwork.esatya.io';//AppSettings.get('network').url;
const web3 = new Web3(new Web3.providers.HttpProvider(httpProvider));

export default web3;
