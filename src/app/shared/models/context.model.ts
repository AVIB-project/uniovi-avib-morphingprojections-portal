export class Context {
    private _user: any;
    private _organizationId: string;
    private _projectId: string;
    private _caseId: string;
    private _bucketDataMatrix: string;
    private _fileDataMatrix: string;
    private _bucketSampleAnnotation: string;
    private _fileSampleAnnotation: string;
    private _bucketAttributeAnnotation: string;
    private _fileAttributeAnnotation: string;
    private _bucketSampleProjection: string;
    private _fileSampleProjection: string;
    private _bucketAttributeProjection: string;
    private _fileAttributeProjection: string;
    
    public get user() {
        return this._user;
    }

    public set user(value: any) {
        this._user = value;
    }    

    public get organizationId() {
        return this._organizationId;
    }

    public set organizationId(value: string) {
        this._organizationId = value;
    }
    
    public get projectId() {
        return this._projectId;
    }

    public set projectId(value: string) {
        this._projectId = value;
    } 
    
    public get caseId() {
        return this._caseId;
    }

    public set caseId(value: string) {
        this._caseId = value;
    } 
    
    public get bucketDataMatrix() {
        return this._bucketDataMatrix;
    }

    public set bucketDataMatrix(value: string) {
        this._bucketDataMatrix = value;
    }
    
    public get fileDataMatrix() {
        return this._fileDataMatrix;
    }
    
    public set fileDataMatrix(value: string) {
        this._fileDataMatrix = value;
    }
    
    public get bucketSampleAnnotation() {
        return this._bucketSampleAnnotation;
    }
    
    public set bucketSampleAnnotation(value: string) {
        this._bucketSampleAnnotation = value;
    }
    
    public get fileSampleAnnotation() {
        return this._fileSampleAnnotation;
    }
    
    public set fileSampleAnnotation(value: string) {
        this._fileSampleAnnotation = value;
    }
    
    public get bucketAttributeAnnotation() {
        return this._bucketAttributeAnnotation;
    }

    public set bucketAttributeAnnotation(value: string) {
        this._bucketAttributeAnnotation = value;
    }
    
    public get fileAttributeAnnotation() {
        return this._fileAttributeAnnotation;
    }
        
    public set fileAttributeAnnotation(value: string) {
        this._fileAttributeAnnotation = value;
    }
    
    public get bucketSampleProjection() {
        return this._bucketSampleProjection;
    } 
    
    public set bucketSampleProjection(value: string) {
        this._bucketSampleProjection = value;
    } 
    
    public get bucketAttributeProjection() {
        return this._bucketAttributeProjection;
    }  
    
    public set bucketAttributeProjection(value: string) {
        this._bucketAttributeProjection = value;
    } 
    
    public get fileSampleProjection() {
        return this._fileSampleProjection;
    } 
    
    public set fileSampleProjection(value: string) {
        this._fileSampleProjection = value;
    } 
    
    public get fileAttributeProjection() {
        return this._fileAttributeProjection;
    }   
    
    public set fileAttributeProjection(value: string) {
        this._fileAttributeProjection = value;
    }    
}