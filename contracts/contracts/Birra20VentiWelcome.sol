// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { LSP8IdentifiableDigitalAsset } from "@lukso/lsp8-contracts/contracts/LSP8IdentifiableDigitalAsset.sol";
import { _LSP4_TOKEN_TYPE_NFT } from "@lukso/lsp4-contracts/contracts/LSP4Constants.sol";
import { _LSP8_TOKENID_FORMAT_NUMBER } from "@lukso/lsp8-contracts/contracts/LSP8Constants.sol";

/**
 * @title Birra20VentiWelcome
 * @dev Token LSP8 benvenuto per i clienti di Birra20Venti
 * - Un contratto unico riusabile per tutti gli eventi
 * - Immagine e nome evento passati al mint di ogni token
 * - Un solo token per cliente per evento
 * - Non rideplorare per ogni evento
 */
contract Birra20VentiWelcome is LSP8IdentifiableDigitalAsset {

    error NotAuthorized(address caller);
    error ClienteHaGiaTokenPerEvento(address cliente, string evento);

    // cliente => evento => tokenId
    mapping(address => mapping(string => bytes32)) public tokenDelClientePerEvento;
    mapping(address => mapping(string => bool))    public haRicevutoPerEvento;

    uint256 private _tokenCounter;

    event TokenBenvenutoMintato(
        address indexed cliente,
        bytes32 tokenId,
        string evento,
        uint256 timestamp
    );

    constructor(
        string memory name,
        string memory symbol,
        address owner
    ) LSP8IdentifiableDigitalAsset(
        name,
        symbol,
        owner,
        _LSP4_TOKEN_TYPE_NFT,
        _LSP8_TOKENID_FORMAT_NUMBER
    ) {}

    modifier soloAdmin() {
        if (msg.sender != owner()) revert NotAuthorized(msg.sender);
        _;
    }

    function mintBenvenuto(
        address cliente,
        string calldata evento,
        string calldata ipfsImageURI,
        uint256 imageWidth,
        uint256 imageHeight
    ) external soloAdmin {
        if (haRicevutoPerEvento[cliente][evento])
            revert ClienteHaGiaTokenPerEvento(cliente, evento);

        _tokenCounter++;
        bytes32 tokenId = bytes32(_tokenCounter);

        haRicevutoPerEvento[cliente][evento]      = true;
        tokenDelClientePerEvento[cliente][evento] = tokenId;

        _mint(cliente, tokenId, true, "");

        // Metadati LSP4 specifici per questo token
        string memory meta = string(abi.encodePacked(
            '{"LSP4Metadata":{"name":"Birra20Venti Welcome","description":"1 birra omaggio ogni 5 acquisti. Ordina con i dati con cui ti sei registrato."',
            ',"images":[[{"width":', _uint2str(imageWidth),
            ',"height":', _uint2str(imageHeight),
            ',"url":"', ipfsImageURI,
            '","verification":{"method":"keccak256(bytes)","data":"0x"}}]]',
            ',"attributes":[',
            '{"key":"brand","value":"Birra20Venti"},',
            '{"key":"benefit","value":"1 birra omaggio ogni 5 acquisti"},',
            '{"key":"evento","value":"', evento, '"}',
            ']}}'
        ));

        bytes32 metaKey = keccak256(abi.encodePacked("LSP8MetadataJSON:", tokenId));
        _setData(metaKey, bytes(meta));

        emit TokenBenvenutoMintato(cliente, tokenId, evento, block.timestamp);
    }

    // Utility: uint256 → string
    function _uint2str(uint256 v) internal pure returns (string memory) {
        if (v == 0) return "0";
        uint256 j = v;
        uint256 len;
        while (j != 0) { len++; j /= 10; }
        bytes memory b = new bytes(len);
        uint256 k = len;
        while (v != 0) { k--; b[k] = bytes1(uint8(48 + v % 10)); v /= 10; }
        return string(b);
    }
}
