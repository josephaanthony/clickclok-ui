import { Injectable } from '@angular/core';
import { Web3 } from "web3";
import { AlertController } from '@ionic/angular';
import { v4 as uuidv4 } from 'uuid';
import { GameService } from './game.service';
import * as moment from 'moment-timezone'

declare const window: any;

@Injectable({
    providedIn: 'root'
})
export class ContractService {
    private web3: any;
    private contract: any;
    private senderAddress: any;
    private walletType: ContractService.WALLET_TYPE = ContractService.WALLET_TYPE.GOOGLE;
    
    public isCryptoWalletAvailable = false;

    GAME_NAME = "Game1";

    CONTRACT_ADDRESS = '0xf8c63B1892995C56D060fEbe2a7eBcB2bc406f4f'
    CONTRACT_ABI = [{"inputs":[{"internalType":"uint256","name":"cap","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256","name":"increasedSupply","type":"uint256"},{"internalType":"uint256","name":"cap","type":"uint256"}],"name":"ERC20ExceededCap","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"uint256","name":"cap","type":"uint256"}],"name":"ERC20InvalidCap","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"inputs":[{"internalType":"uint256","name":"blockTimestmap","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"TimestampNotPassedError","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"airDropValue","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"cap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"gameCreator","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAirDrop","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getTokenData","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mintWinner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"playerList","outputs":[{"internalType":"uint256","name":"size","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"milliSeconds","type":"uint256"}],"name":"setTimeOutMilliseconds","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"stake","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"timeOutMillisecond","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract ERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];

    constructor(private alertController: AlertController, private gameService: GameService) { 
        this.isCryptoWalletAvailable = (typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined')
    }

    public openWallet = async (walletType: ContractService.WALLET_TYPE): Promise<string> => {
        if(walletType == ContractService.WALLET_TYPE.METAMASK) {
            if (typeof window.ethereum !== 'undefined') {

                this.alertController.create({message: "The first block"});
    
                this.web3 = new Web3(window.ethereum);
                try {
                // Request account access
                    await window.ethereum.enable();
                } catch (error) {
                // User denied account access
                    console.error('User denied account access');
                }
            } else if (typeof window.web3 !== 'undefined') {
                this.alertController.create({message: "The second block"});    
    
                // Use existing provider
                this.web3 = new Web3(window.web3.currentProvider);
            }
        
            if(this.web3) {
                // Instantiate contract
                this.contract = new this.web3.eth.Contract(this.CONTRACT_ABI, this.CONTRACT_ADDRESS);
                const accounts = await this.web3.eth.getAccounts();
                this.senderAddress = accounts[0];
            }
        }
        else {
            this.senderAddress = (await this.gameService.login()).email

            // let claims = this.gameService.login();
            // if(claims) {
            //     this.senderAddress = claims["email"];
            // }
        }

        this.walletType = walletType;

        this.gameService.registerUser(this.GAME_NAME, this.senderAddress, this.walletType);
        return this.senderAddress;
    }

    async confirmPayment(data: any) {
        this.gameService.confirmPayment(this.GAME_NAME, this.senderAddress, data);
    }

    async getContractUpdates() {
        let result: any;
        if(this.web3) {
            result = await this.contract.methods.getTokenData().call();
            result = {
                potEquity: parseInt(result[0]) / (10 ** 18),
                currentTimestamp: parseInt(result[2]),
                lastExecutedTimestamp: parseInt(result[1])
            }
            // const result2 = await this.contract.methods.lastExecutedTimestamp().call();    
        } else {
            result = await this.gameService.getContractUpdates(this.GAME_NAME, this.senderAddress, this.walletType);

            result = {
                ... result,
                currentTimestamp: moment().unix(),
                lastExecutedTimestamp: moment(result.lastExecutedTimestamp).unix()
            }
        }


        console.log('Result:', result);
        return result;
    }

    async getAirDrop() {
        // Example: Call a read-only function
        var result = null;
        if(this.web3) {
            result = await this.contract.methods.getAirDrop().send({ from: this.senderAddress });    
        } else {
            result = this.gameService.getAirDrop(this.GAME_NAME, this.senderAddress);
        }

        console.log('Result:', result);
        return result;
    }

    async sendTransaction() {
        if(this.web3) {
            const amountToSend = this.web3.utils.toWei(0.000001, 'ether');
            // Example: Send a transaction to a contract function
            await this.contract.methods.stake(amountToSend).send({ from: this.senderAddress });    
        } else {
            this.gameService.stake(this.GAME_NAME, this.walletType, this.senderAddress, 30);
        }
        console.log('Transaction sent!');
    }
    
}

export namespace ContractService {
    export enum WALLET_TYPE {
        METAMASK = "METAMASK",
        GOOGLE = "GOOGLE"
    }    
}